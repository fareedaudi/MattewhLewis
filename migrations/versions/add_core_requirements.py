from alembic import op
import sqlalchemy as sa

with op.batch_alter_table('university', schema=None) as batch_op:
        batch_op.add_column(sa.Column('is_university', sa.Boolean(), nullable=True))
        batch_op.add_column(sa.Column('FICE', sa.String(250), nullable=True))
        batch_op.add_column(sa.Column('SJC_trans_imp', sa.Integer(), nullable=True))

op.create_table('component_requirement',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('univ_id', sa.Integer(), nullable=True),
    sa.Column('component_code', sa.String(250), nullable=True),
    sa.Column('course_id', sa.Integer(), nullable=True),
    sa.ForeignKeyConstraint(['univ_id'], ['university.id'], ),
    sa.ForeignKeyConstraint(['course_id'], ['course.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    # ### end Alembic commands ###